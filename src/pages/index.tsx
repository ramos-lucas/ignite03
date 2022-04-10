import { useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Prismic from '@prismicio/client';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import { PostAuthor } from '../components/PostAuthor';
import { PostDate } from '../components/PostDate';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: NextPage<HomeProps> = ({
  postsPagination: { results, next_page: nextPage },
}) => {
  const [pagination, setPagination] = useState({ results, nextPage });

  const loadMore = async (): Promise<void> => {
    const response = await (await fetch(nextPage)).json();
    setPagination(prev => ({
      nextPage: response.next_page,
      results: [...prev.results, ...response.results],
    }));
  };

  return (
    <main className={commonStyles.pageContainer}>
      <ul className={styles.postList}>
        {pagination.results.map(item => (
          <li key={item.uid}>
            <Link href={`/post/${item.uid}`}>
              <a>
                <h2>{item.data.title}</h2>
                <p>{item.data.subtitle}</p>
                <div className={styles.postFooter}>
                  <PostDate date={item.first_publication_date} />
                  <PostAuthor name={item.data.author} />
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      {!!nextPage && (
        <button type="button" className={styles.loadMore} onClick={loadMore}>
          Carregar mais posts
        </button>
      )}
    </main>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    { pageSize: 3 }
  );

  return {
    props: {
      postsPagination: response,
    },
  };
};
