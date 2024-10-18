import { useState } from "react";
import { NavLink, useLoaderData } from "react-router-dom";
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
      {isCreating && <AssetCreationDialog onClose={onClose} />}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Assets" openDialog={openDialog} />
      <div className="flex flex-wrap gap-2 m-2">
        {assets
          .filter((a: any) => a.assetEntries.length > 0)
          .map((asset: any) => (
            <div
              key={asset.id}
              className="bg-mediumBlue hover:bg-mediumBlue3 shadow-lg rounded-lg w-64 h-72 flex flex-col gap-2"
            >
              <NavLink
                to={ROUTES.ASSET_DETAILS(asset.id)}
                className="flex flex-col"
              >
                <div className="bg-mediumBlue3 rounded-t-lg p-2">
                  <img
                    src={
                      Constants.backendUrl +
                      "/api/v3/assets/image/" +
                      asset.assetEntries[0].id
                    }
                    alt="asset"
                    className="w-full h-32 object-cover rounded-lg bg-lightBlue"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <div className="p-1">
                  <h1 className="text-xl font-bold h-8">{asset.title}</h1>
                  <p className="text-gray-500 overflow-hidden text-ellipsis h-8">
                    {asset.description}
                  </p>
                  <div className="h-8">
                    Created at{" "}
                    {new Date(asset.createdAt * 1000).toLocaleDateString()}
                  </div>
                  <div></div>
                </div>
              </NavLink>

              {asset.assetEntries.length > 0 && (
                <>
                  <a
                    href={
                      Constants.backendUrl +
                      "/api/v3/assets/image/" +
                      asset.assetEntries[0].id +
                      "?download=true"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="bg-lightBlue text-white px-2 py-1 rounded-lg">
                      Download
                    </button>
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
