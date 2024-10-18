import { useState } from "react";
import {
  LoaderFunction,
  NavLink,
  useLoaderData,
  useParams,
} from "react-router-dom";
import HeaderView from "../components/HeaderView";
import { Asset } from "../models/asset";
import { Breadcrumb } from "../models/breadcrumb";
import { ROUTES } from "../routes";
import Client from "../services/Client";
import Constants from "../services/Constants";
import AssetCreationDialog from "./AssetCreationDialog";
import {
  ArrowDownTrayIcon,
  FaceSmileIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";

const AssetDetailView: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { asset } = useLoaderData() as { asset: Asset };

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Assets", link: ROUTES.ASSETS },
    { title: `${assetId}`, link: "" },
  ];

  function downloadAsset(entryId: number) {
    return (
      <a
        href={`${Constants.backendUrl}/api/v3/assets/image/${entryId}?download=true`}
        target="_blank"
        className="hover:text-lightBlue"
        rel="noreferrer"
      >
        <ArrowDownTrayIcon className="h-6 w-6" />
      </a>
    );
  }

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-4xl m-2 cursor-default flex items-center gap-2">
        <div>
          #{asset.id} {asset.title}
        </div>
        {asset.assetEntries.length > 0 && (
          <>
            <div>{" - Version " + asset.assetEntries[0]?.versionNumber}</div>
            {downloadAsset(asset.assetEntries[0].id)}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <div key={asset.id} className=" w-full p-1 h-full bg-mediumBlue">
          <img
            src={
              Constants.backendUrl +
              "/api/v3/assets/image/" +
              asset.assetEntries[0].id
            }
            alt={asset.title}
            className="max-w-full max-h-full min-w-32 min-h-32 bg-mediumBlue3"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>
        <div className="text-gray-500 w-64 bg-mediumBlue rounded-lg">
          {asset.assetEntries.map((entry) => (
            <div key={entry.id} className="flex p-2">
              <NavLink
                to={
                  ROUTES.ASSET_DETAILS(asset.id) +
                  `?version=${entry.versionNumber}`
                }
                className="flex-grow"
              >
                #{entry.versionNumber}
              </NavLink>
              {downloadAsset(entry.id)}
            </div>
          ))}
        </div>
      </div>
      <div>{asset.description}</div>
    </>
  );
};

export default AssetDetailView;

export const loader: LoaderFunction<{
  assetId: string;
}> = async ({ params }) => {
  const assetId = params.assetId ?? "";
  const asset = await Client.shared.get(`/assets/${assetId}`);
  return { asset };
};
