import SavedList from "@/components/saved/SavedList";

const SavesPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page header */}
      <h1 className="mb-6 text-3xl font-bold">
        Saves
      </h1>

      {/* Saved questions and posts */}
      <SavedList />
    </div>
  );
};

export default SavesPage;