import { FiCalendar } from 'react-icons/fi';

import styles from './postDate.module.scss';

type Props = {
  date: string;
};

const PostDate: React.FC<Props> = ({ date }) => (
  <span className={styles.postDate}>
    <FiCalendar size={20} />
    {date}
  </span>
);

export { PostDate };
