import { useState } from "react";
import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import HeaderView from "../../components/HeaderView";
import PasswordCreationDialog from "../../components/passwords/PasswordCreationDialog";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import { ROUTES } from "../../routes";
import { PasswordService } from "../../services/PasswordService";

const passwordService = PasswordService.shared;

const Passwords: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as PasswordEnvironment[];
  const [environments, setEnvironments] = useState<PasswordEnvironment[]>(data);
  const [editingEntry, setEditingEntry] = useState<PasswordEnvironment | null>(
    null
  );

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Passwords", link: "" },
  ];

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose() {
    setIsCreating(false);
    // refresh environments always
    setEnvironments(await passwordService.getAllEnvironments());
  }

  function openEditDialog(environment: PasswordEnvironment) {
    setEditingEntry(environment);
    setIsCreating(true);
  }

  return (
    <div>
      {isCreating && (
        <PasswordCreationDialog editingEntry={editingEntry} onClose={onClose} />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Environments" openDialog={openDialog} />
      <div className="flex flex-wrap">
        {environments.map((environment: any) => (
          <div
            key={environment.id}
            className="relative w-[45%] md:w-[240px] h-[300px] gap-4  flex justify-center items-center p-8 m-2 border hover:bg-slate-800 rounded-md text-white"
          >
            <NavLink
              key={environment.id}
              to={ROUTES.PASSWORDS_ENTRIES(environment.id)}
              className="w-full flex flex-col items-center gap-2"
            >
              <div className="text-lg font-semibold text-center">
                {environment.title}
              </div>
              <div className="bg-mediumBlue rounded px-2 py-1 text-center">
                {environment.numberOfEntries}
              </div>
            </NavLink>
            <div className="absolute top-4 right-4">
              <Button
                title="Edit"
                onClick={() => openEditDialog(environment)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Passwords;

export const loader: LoaderFunction<{ projectSlug: string }> = async () => {
  return await passwordService.getAllEnvironments();
};
