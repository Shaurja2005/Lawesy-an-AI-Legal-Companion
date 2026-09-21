export const metadata = {
  title: 'Lawyer Brief - Lawesy',
};

export default function BriefPage({ params }: { params: { docId: string } }) {
  return (
    <div>
      <h1>Lawyer Brief</h1>
      <p>Brief for document: {params.docId}</p>
    </div>
  );
}
