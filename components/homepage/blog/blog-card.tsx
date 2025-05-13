import { BlogType } from "./blog";
import Image from "next/image";
import Link from "next/link";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

export default function BlogCard({ blog }: { blog: BlogType }) {
  return (
    <Link href={blog.url} target="_blank">
      <div className="rounded-lg overflow-hidden border hover:border-violet-500 border-[#1d1d1d] hover:scale-105 transition-all duration-200">
        <div className="relative w-full h-[200px]">
          <Image
            src={blog.cover_image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {blog.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{blog.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{blog.reading_time_minutes} min read</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <AiOutlineHeart />
                {blog.public_reactions_count}
              </span>
              <span className="flex items-center gap-1">
                <FaRegComment />
                {blog.comments_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
