import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaArchive, FaLock, FaUser } from "react-icons/fa";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ButtonIcon } from "../../components/ButtonIcon";
import HeaderView from "../../components/HeaderView";
import PasswordEntryCreationDialog from "../../components/passwords/PasswordEntryCreationDialog";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import useIsMobile from "../../hooks/useIsMobile";
import { Breadcrumb } from "../../models/breadcrumb";
import { PasswordEntry } from "../../models/passwords/password-entry";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import { ROUTES } from "../../routes";
import { PasswordService } from "../../services/passwordService";
import { showToast } from "../../utils/tbToast";

const passwordService = PasswordService.shared;

const PasswordEntries: React.FC = () => {
  const isMobile = useIsMobile();

  const data = useLoaderData() as {
    environment: PasswordEnvironment;
    entries: PasswordEntry[];
  };
  const [isCreating, setIsCreating] = useState(false);
  const [entries, setEntries] = useState<PasswordEntry[]>(data.entries);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Passwords", link: ROUTES.PASSWORDS },
    { title: data.environment.title, link: "" },
  ];

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isMobile]);

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
    await reload();
    setEditingEntry(null);
  }

  async function reload() {
    const newData = await passwordService.getAllEntries(data.environment.id);
    setEntries(newData.entries);
  }

  function copyUser(value: string) {
    navigator.clipboard.writeText(value);
    showToast("success", "", "Copied username to clipboard");
  }

  function copyPass(value: string) {
    navigator.clipboard.writeText(value);
    showToast("success", "", "Copied password to clipboard");
  }

  async function toggleArchive(entry: PasswordEntry) {
    entry.archived = !entry.archived;
    await passwordService.updateEntry(data.environment.id, entry.id, entry);
    await reload();
  }

  return (
    <div>
      <AnimatePresence>
        {isCreating && (
          <PasswordEntryCreationDialog
            editingEntry={editingEntry}
            environment={data.environment}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
        <TitleView title={data.environment.title} openDialog={openDialog} />
        <div className="items-center flex gap-2">
          <Toggle
            title="Archived"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          <input
            type="text"
            ref={inputRef}
            placeholder="Search"
            className="bg-row rounded-xl border-border border px-3 w-48 sm:w-64 py-1 h-10 me-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col w-full mt-2">
        {entries
          .filter((entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter((entry) => (showAll ? true : !entry.archived))
          .map((entry) => (
            <div
              className="tb-row !gap-1 !p-0 !px-2 cursor-pointer max-w-full"
              key={entry.id}
            >
              <ButtonIcon onClick={() => copyUser(entry.login)}>
                <FaUser className="w-5 h-5" />
              </ButtonIcon>
              <ButtonIcon onClick={() => copyPass(entry.password)}>
                <FaLock className="w-5 h-5" />
              </ButtonIcon>
              <div
                className="flex justify-between w-full p-2"
                onClick={() => openEditDialog(entry)}
              >
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-32 sm:max-w-full">
                  {entry.title}
                </div>
                <div className="flex-1 text-gray-400 overflow-hidden text-ellipsis  max-w-32 sm:max-w-full">
                  {entry.login}
                </div>
              </div>
              <ButtonIcon onClick={() => toggleArchive(entry)}>
                <FaArchive
                  color={entry.archived ? "olive" : undefined}
                  className="w-5 h-5"
                />
              </ButtonIcon>
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
