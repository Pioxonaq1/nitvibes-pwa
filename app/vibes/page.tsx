import Link from "next/link";
import Image from "next/image";
import { client } from "../../sanity/client";

// OBLIGAMOS A QUE SE ACTUALICE SIEMPRE
export const dynamic = "force-dynamic";

// FUNCIÓN PARA PEDIR DATOS A SANITY
async function getPosts() {
  // [0...8] = Trae las últimas 8 noticias
  const query = `*[_type == "post"] | order(publishedAt desc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    "image": mainImage.asset->url,
    publishedAt,
    "category": categories[0]->title,
    excerpt
  }`;
  
  return await client.fetch(query);
}

export const metadata = {
  title: 'Vibes | NITVIBES',
  description: 'Las mejores reseñas y noticias de la noche en Barcelona.',
};

export default async function VibesPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col pb-28">
      
      {/* --- CABECERA --- */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between">
        <Link href="/" className="text-yellow-400 font-bold text-xl tracking-tighter">
          ⚡ NITVIBES
        </Link>
        <span className="text-xs font-bold bg-gray-800 px-2 py-1 rounded text-gray-300">VIBES</span>
      </div>

      {/* --- TÍTULO --- */}
      <div className="p-6 pt-8">
        <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          LATEST VIBES
        </h1>
        <p className="text-gray-400 text-sm">
          Lo que pasa en la noche, se queda aquí.
        </p>
      </div>

      {/* --- LISTA DE NOTICIAS --- */}
      <div className="px-4 space-y-6 max-w-2xl mx-auto flex-grow w-full">
        
        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-10 border border-gray-800 rounded-xl bg-gray-900/50 p-6">
            <p className="text-2xl mb-2">📭</p>
            <p>No hay vibes publicados aún.</p>
          </div>
        )}

        {/* TARJETAS DE VIBES */}
        {posts.map((post: any) => (
          <Link key={post._id} href={`/vibes/${post.slug}`}>
            <article className="group cursor-pointer bg-gray-900/20 rounded-2xl p-3 border border-gray-800 hover:border-purple-500/50 transition-all mb-6">
              
              {/* IMAGEN COMPLETA (object-contain) */}
              <div className="relative h-56 w-full rounded-xl overflow-hidden mb-3 border border-gray-800 shadow-sm bg-black/50">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold tracking-widest">
                      NITVIBES
                  </div>
                )}
                
                {post.category && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 z-10">
                    {post.category}
                  </div>
                )}
              </div>

              {/* Texto */}
              <div>
                <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>
                      {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString() 
                          : "Reciente"}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-tight mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                      {post.excerpt}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}