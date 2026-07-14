
import React, { useMemo } from 'react';
import Blogs from '../Blogs';
import Image from '@/src/components/atoms/Image';
import { sanitizeHTML } from './Sanitize';

function BlogDetailsClient({ initialBlog }) {

    const blog = useMemo(() => initialBlog, [initialBlog]);

    return (
        <div className="min-h-screen ">
            <main className='space-y-4'>
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <article className="lg:col-span-3">

                        <div className="w-full aspect-[16/8] rounded-xl overflow-hidden">
                            <Image
                                src={blog?.image?.url}
                                alt={blog?.image?.alt || blog?.heading || "Blog image"}
                            />
                        </div>

                        <h1
                            className="text-base font-bold py-2"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(blog?.heading)
                            }}
                        />

                        <p className="py-2 text-xs text-gray-600">
                            {blog?.subHeading}
                        </p>

                        <section
                            className="text-xs text-gray-600 mb-4"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(blog?.description)
                            }}
                        />

                        {blog?.sections?.map((section, idx) => (
                            <section key={idx}>

                                <h2 className="text-sm font-bold py-2">
                                    {section.title}
                                </h2>

                                {section?.image?.url && (
                                    <div className="w-full aspect-[16/8] rounded-xl overflow-hidden">
                                        <Image
                                            src={section.image.url}
                                            alt={section.image?.alt || section.title}
                                        />
                                    </div>
                                )}

                                <div
                                    className="text-xs text-gray-600 py-2"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHTML(section?.content)
                                    }}
                                />

                                {section?.paragraphs &&
                                    Object.values(section.paragraphs).map((para, i) => (
                                        <div
                                            key={i}
                                            className="text-xs text-gray-600 py-2"
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHTML(para)
                                            }}
                                        />
                                    ))}

                                {section?.comments?.length > 0 && (
                                    <ul className="list-disc pl-5 text-xs text-gray-600 ">
                                        {section.comments.map((c, i) => (
                                            <li
                                                key={i}
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHTML(c.point)
                                                }}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </article>
                </div>

                <Blogs tag="Similar Blogs" />
            </main>
        </div>
    );
}

export default BlogDetailsClient;