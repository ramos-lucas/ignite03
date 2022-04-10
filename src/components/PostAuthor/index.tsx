import { FiUser } from 'react-icons/fi';

import styles from './postAuthor.module.scss';

type Props = {
  name: string;
};

const PostAuthor: React.FC<Props> = ({ name }) => (
  <span className={styles.author}>
    <FiUser size={20} />
    {name}
  </span>
);

export { PostAuthor };
