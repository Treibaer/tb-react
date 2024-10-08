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
  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Passwords", link: ROUTES.PASSWORDS },
    { title: data.environment.title, link: "" },
  ];

  function openDialog() {
    setIsCreating(true);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
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
          environment={data.environment}
          onClose={onClose}
        />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
        <TitleView title={data.environment.title} openDialog={openDialog} />
        <input
          type="text"
          placeholder="Search"
          className="bg-mediumBlue rounded-xl px-3 w-64 py-1 h-10 me-4"
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col">
        {entries
          .filter((entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((entry) => (
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
  return await passwordService.getAllEntries(Number(environmentId));
};
