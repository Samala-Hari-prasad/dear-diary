import { getAttachmentsList } from "@/lib/github/storage";
import { FileText, Music, Image as ImageIcon } from "lucide-react";

export default async function GalleryPage() {
  const [images, audio, pdfs] = await Promise.all([
    getAttachmentsList("images"),
    getAttachmentsList("audio"),
    getAttachmentsList("pdf")
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Attachment Gallery</h1>
        <p className="text-muted-foreground text-sm">Browse all your uploaded files across all memories.</p>
      </div>

      <div className="space-y-12">
        {/* Images Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground font-medium border-b border-border pb-2">
            <ImageIcon size={18} className="text-primary" />
            <h2>Photos ({images.length})</h2>
          </div>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <a key={img.name} href={img.url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-border hover:opacity-80 transition-opacity bg-muted/20">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No photos found.</p>
          )}
        </section>

        {/* Audio Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground font-medium border-b border-border pb-2">
            <Music size={18} className="text-primary" />
            <h2>Audio ({audio.length})</h2>
          </div>
          {audio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audio.map(aud => (
                <div key={aud.name} className="p-4 bg-muted/20 border border-border rounded-lg">
                  <p className="text-sm font-medium mb-3 truncate" title={aud.name}>{aud.name}</p>
                  <audio controls src={aud.url} className="w-full h-10 outline-none" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No audio recordings found.</p>
          )}
        </section>

        {/* PDF Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground font-medium border-b border-border pb-2">
            <FileText size={18} className="text-primary" />
            <h2>PDFs ({pdfs.length})</h2>
          </div>
          {pdfs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pdfs.map(pdf => (
                <a key={pdf.name} href={pdf.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group no-underline">
                  <div className="bg-red-500/10 p-3 rounded-md mr-4 text-red-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-sm text-foreground truncate m-0 leading-tight">{pdf.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-0">{(pdf.size / 1024).toFixed(1)} KB</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDFs found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
