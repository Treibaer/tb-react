import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import PasswordEntryCreationDialog from "../../components/passwords/PasswordEntryCreationDialog";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { PasswordEntry } from "../../models/passwords/password-entry";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import { ROUTES } from "../../routes";
import { PasswordService } from "../../services/PasswordService";

const passwordService = PasswordService.shared;

const PasswordEntries: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as {
    environment: PasswordEnvironment;
    entries: PasswordEntry[];
  };
  const [entries, setEntries] = useState<PasswordEntry[]>(data.entries);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Passwords", link: ROUTES.PASSWORDS },
    { title: data.environment.title, link: "" },
  ];

  function openDialog() {
    setIsCreating(true);
  }

  async function openEditDialog(entry: PasswordEntry) {
    setEditingEntry(entry);
    setIsCreating(true);
  }

  async function onClose() {
    setIsCreating(false);
    // refresh environments always
    const newData = await passwordService.getAllEntries(data.environment.id);
    setEntries(newData.entries);
    setEditingEntry(null);
  }

  return (
    <div>
      {isCreating && (
        <PasswordEntryCreationDialog
          editingEntry={editingEntry}
          environmentId={data.environment.id}
          onClose={onClose}
        />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title={data.environment.title} openDialog={openDialog} />
      <div className="flex flex-col">
        {entries.map((entry) => (
          <div
            className="tb-row cursor-pointer"
            key={entry.id}
            onClick={() => openEditDialog(entry)}
          >
            <div className="flex-1">{entry.title}</div>
            <div className="flex-1 text-gray-400">{entry.login}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordEntries;

export const loader: LoaderFunction<{ environmentId: string }> = async ({
  params,
}) => {
  const { environmentId } = params as { environmentId: string };
  console.log("environmentId", environmentId);

  return await passwordService.getAllEntries(Number(environmentId));
};
