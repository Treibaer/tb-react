import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NavLink, useLoaderData } from "react-router-dom";
import { ButtonIcon } from "../components/ButtonIcon";
import HeaderView from "../components/HeaderView";
import TitleView from "../components/TitleView";
import { Asset } from "../models/asset";
import { Breadcrumb } from "../models/breadcrumb";
import { ROUTES } from "../routes";
import Client from "../services/Client";
import Constants from "../services/Constants";
import AssetCreationDialog from "./AssetCreationDialog";

const Assets: React.FC = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Assets", link: "" },
  ];

  const [isCreating, setIsCreating] = useState(false);
  function openDialog() {
    setIsCreating(true);
  }

  const { assets: initialAssets } = useLoaderData() as { assets: Asset[] };

  const [assets, setAssets] = useState<Asset[]>(initialAssets);

  async function fetchAssets() {
    const assets = await Client.shared.get<Asset[]>("/assets");
    setAssets(assets);
  }

  async function onClose() {
    setIsCreating(false);
    await fetchAssets();
  }

  return (
    <>
      <AnimatePresence>
        {isCreating && <AssetCreationDialog onClose={onClose} />}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Assets" openDialog={openDialog} />
      <div className="flex flex-wrap gap-2 m-2">
        {assets
          .filter((a: any) => a.assetEntries.length > 0)
          .map((asset: any) => (
            <div
              key={asset.id}
              className="bg-mediumBlue relative hover:bg-mediumBlue3 shadow-lg rounded-lg w-60 h-52 flex flex-col gap-2"
            >
              <NavLink
                to={ROUTES.ASSET_DETAILS(asset.id)}
                className="flex flex-col"
              >
                <div className="rounded-t-lg p-2">
                  <h1 className="text-lg font-bold h-8 mb-1">{asset.title}</h1>
                  <img
                    src={
                      Constants.backendUrl +
                      "/api/v3/assets/image/" +
                      asset.assetEntries[0].id
                    }
                    alt="asset"
                    className="w-full h-32 object-contain rounded-lg bg-lightBlue"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <div className="p-1">
                  <p className="text-gray-500 overflow-hidden text-ellipsis h-6">
                    {asset.description}
                  </p>
                  <div></div>
                </div>
              </NavLink>

              <div className="absolute select-none top-[138px] right-3 text-sm p-1 rounded-lg bg-[rgb(50,50,50)]">
                {new Date(asset.createdAt * 1000).toLocaleDateString()}
              </div>

              {asset.assetEntries.length > 0 && (
                <>
                  <a
                    className="absolute top-1 right-1 bg-mediumBlue rounded-lg"
                    href={
                      Constants.backendUrl +
                      "/api/v3/assets/image/" +
                      asset.assetEntries[0].id +
                      "?download=true"
                    }
                    rel="noreferrer"
                    title="Download"
                  >
                    <ButtonIcon>
                      <ArrowDownTrayIcon className="w-6 h-6" />
                    </ButtonIcon>
                  </a>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Assets;

export const loader = async () => {
  const assets = await Client.shared.get("/assets");
  return { assets };
};
