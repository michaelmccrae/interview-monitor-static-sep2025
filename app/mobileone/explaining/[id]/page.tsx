import Version from './verone'

export default function Page({ params, searchParams }: {
  params: { id: string },
  searchParams: { [key: string]: string | string[] | undefined }
  }) {
  return <Version id={params.id} fileName={searchParams.fileName as string | undefined} />
}
