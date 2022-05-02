import { useEffect } from "react";

import { usePreviewSubscription } from "~/lib";

export default function Preview<T>({
  data,
  setData,
  query,
  queryParams,
  sanityProjectId,
  sanityDataset,
}: {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  query: string;
  queryParams: Record<string, unknown>;
  sanityProjectId: string;
  sanityDataset: string;
}) {
  const { data: previewData } = usePreviewSubscription(
    query,
    sanityProjectId,
    sanityDataset,
    {
      params: queryParams,
      initialData: data,
    }
  );

  useEffect(() => setData(previewData), [previewData, setData]);

  return <div>Preview Mode</div>;
}
