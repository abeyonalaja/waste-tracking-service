interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps): React.ReactNode {
  return <h1>Task list page for id: {params.id}</h1>;
}
