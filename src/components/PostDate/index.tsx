import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';
import localePtBr from 'date-fns/locale/pt-BR';

import styles from './postDate.module.scss';

type Props = {
  date: string;
};

const PostDate: React.FC<Props> = ({ date }) => (
  <span className={styles.postDate}>
    <FiCalendar size={20} />
    {format(new Date(date), 'dd MMM yyyy', {
      locale: localePtBr,
    })}
  </span>
);

export { PostDate };
