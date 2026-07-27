export default function AppHome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h2 className="text-2xl font-semibold mb-2">Welcome to The Digital Diary</h2>
      <p className="text-muted-foreground max-w-md">
        Select an entry from the sidebar to start writing, or create a new memory.
      </p>
    </div>
  );
}
