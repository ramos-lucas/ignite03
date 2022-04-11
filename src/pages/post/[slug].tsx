import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import localePtBr from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { PostAuthor } from '../../components/PostAuthor';
import { PostDate } from '../../components/PostDate';
import { PostReadingTime } from '../../components/PostReadingTime';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: NextPage<PostProps> = ({ post }) => {
  const { isFallback } = useRouter();

  const calcReadingTime = (): number => {
    const totalOfWords = post.data.content.reduce((acc, current) => {
      const headingWords = current.heading.split(' ').length;
      const bodyWords = RichText.asText(current.body).split(' ').length;
      return acc + headingWords + bodyWords;
    }, 0);
    const WORDS_PER_MINUTE = 200;
    return Math.ceil(totalOfWords / WORDS_PER_MINUTE);
  };

  if (isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <main>
      <img src={post.data.banner.url} alt="" width="100%" />
      <article className={`${commonStyles.pageContainer} ${styles.article}`}>
        <h1>{post.data.title}</h1>
        <div className={styles.postDetails}>
          <PostDate date={post.first_publication_date} />
          <PostAuthor name={post.data.author} />
          <PostReadingTime minutes={calcReadingTime()} />
        </div>
        {post.data.content.map(item => (
          <section key={item.heading}>
            <h2>{item.heading}</h2>
            {/* eslint-disable-next-line */}
              <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }} />
          </section>
        ))}
      </article>
    </main>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { fetch: ['post.uid'], pageSize: 3 }
  );

  return {
    paths: posts.results.map(item => ({ params: { slug: item.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'post',
    context.params.slug as string,
    {}
  );

  return {
    props: {
      post: response,
    },
  };
};
