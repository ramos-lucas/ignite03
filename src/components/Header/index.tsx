import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={commonStyles.pageContainer}>
        <Link href="/">
          <a>
            <img src="/spacetraveling.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </div>
  );
}
