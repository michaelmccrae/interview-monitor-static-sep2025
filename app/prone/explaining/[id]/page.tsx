import Version from './verone'

// Example list of IDs to pre-render
const ids = ['1', '2', '3', '4', '5', '6', '7']

export async function generateStaticParams() {
  return ids.map(id => ({ id }))
}

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <Version id={params.id} fileName={searchParams.fileName as string | undefined} />
}
