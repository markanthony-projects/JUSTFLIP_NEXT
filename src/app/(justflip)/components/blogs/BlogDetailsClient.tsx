
import React, { useMemo } from 'react';
import Blogs from '../Blogs';
import Image from '@/src/components/atoms/Image';
import { sanitizeHTML } from './Sanitize';

import { Blog } from "@/src/types";

export interface BlogDetailsClientProps {
    initialBlog?: Blog | null;
}

function BlogDetailsClient({ initialBlog }: BlogDetailsClientProps) {

    const blog = useMemo(() => initialBlog, [initialBlog]);

    // Format the date if available
    const formattedDate = useMemo(() => {
        if (!blog?.date) return null;
        return new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [blog?.date]);

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
                
                <article>
                    {/* HERO HEADER */}
                    <header className="mb-10 text-center max-w-6xl mx-auto">
                        {formattedDate && (
                            <time className="text-sm md:text-base font-semibold text-indigo-600 tracking-wider uppercase mb-4 block">
                                {formattedDate}
                            </time>
                        )}
                        
                        <h1
                            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(blog?.heading)
                            }}
                        />

                        {blog?.subHeading && (
                            <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                                {blog.subHeading}
                            </p>
                        )}
                    </header>

                    {/* COVER IMAGE */}
                    {blog?.image?.url && (
                        <div className="w-full aspect-[16/8] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-12 bg-gray-100">
                            <Image
                                src={blog.image.url}
                                alt={blog.image?.alt || blog?.heading || "Blog cover image"}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    {/* MAIN CONTENT CONTAINER */}
                    <div className="max-w-5xl mx-auto space-y-10">
                        {/* DESCRIPTION / LEAD PARAGRAPH */}
                        {blog?.description && (
                            <section
                                className="text-[17px] md:text-[19px] text-gray-700 leading-relaxed font-serif [&>p]:mb-6 [&>a]:text-indigo-600 [&>a]:underline hover:[&>a]:text-indigo-800 transition-colors"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHTML(blog.description)
                                }}
                            />
                        )}

                        {/* SECTIONS */}
                        {blog?.sections?.map((section, idx) => (
                            <section key={idx} className="scroll-mt-20">
                                
                                {section?.title && (
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 tracking-tight">
                                        {section.title}
                                    </h2>
                                )}

                                {section?.image?.url && (
                                    <figure className="my-8">
                                        <div className="w-full max-w-6xl aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 shadow-md">
                                            <Image
                                                src={section.image.url}
                                                alt={section.image?.alt || section.title || "Section image"}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        {(section.image?.alt || section.title) && (
                                            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                                                {section.image?.alt || section.title}
                                            </figcaption>
                                        )}
                                    </figure>
                                )}

                                {section?.content && (
                                    <div
                                        className="text-[17px] md:text-lg text-gray-800 leading-relaxed [&>p]:mb-6 [&>strong]:text-gray-900 [&>a]:text-indigo-600 [&>a]:underline hover:[&>a]:text-indigo-800"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHTML(section.content)
                                        }}
                                    />
                                )}

                                {section?.paragraphs &&
                                    Object.values(section.paragraphs).map((para, i) => (
                                        <div
                                            key={i}
                                            className="text-[17px] md:text-lg text-gray-800 leading-relaxed mb-6 [&>a]:text-indigo-600 [&>a]:underline"
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHTML(para)
                                            }}
                                        />
                                    ))}

                                {(section?.comments?.length ?? 0) > 0 && (
                                    <ul className="list-disc pl-6 md:pl-8 space-y-3 my-6 text-[17px] md:text-lg text-gray-800 marker:text-indigo-500">
                                        {section?.comments?.map((c, i) => (
                                            <li
                                                key={i}
                                                className="pl-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHTML(c.point)
                                                }}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>
                </article>

            </main>
            {/* SIMILAR BLOGS FOOTER SECTION */}
            <div className="w-full border-t border-gray-200 mt-16 pt-16 pb-12">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
                        Continue Reading
                    </h2>
                    <Blogs tag="Similar Blogs" />
                </div>
            </div>
        </div>
    );
}

export default BlogDetailsClient;