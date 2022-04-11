import { FiClock } from 'react-icons/fi';

import styles from './postReadingTime.module.scss';

type Props = {
  minutes: number;
};

const PostReadingTime: React.FC<Props> = ({ minutes }) => (
  <span className={styles.readingTime}>
    <FiClock size={20} />
    {minutes} min
  </span>
);

export { PostReadingTime };
