import { personalData } from "@/utils/data/personal-data";

async function getBlog(slug: string) {
  const res = await fetch(
    `https://dev.to/api/articles/${personalData.devUsername}/${slug}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const blog = await getBlog(slug);

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
    </div>
  );
}
