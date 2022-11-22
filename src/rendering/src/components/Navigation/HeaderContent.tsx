import { Placeholder, SitecoreContextValue } from '@sitecore-jss/sitecore-jss-nextjs';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { HeaderProps } from './Header';

export type HeaderContentProps = HeaderProps & {
  pathname?: string;
  asPath?: string;
  query?: string | ParsedUrlQueryInput;
  sitecoreContext: SitecoreContextValue;
};

const HeaderContent = (props: HeaderContentProps): JSX.Element => {
  const router = useRouter();

  const sxaStyles = `${props.params?.styles || ''}`;

  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
  });

  const languageList = props.sitecoreContext['Languages'] as NodeJS.Dict<string | string>[];

  const changeLanguage = (lang: string) => {
    if (props.pathname && props.asPath && props.query) {
      router.push(
        {
          pathname: props.pathname,
          query: props.query,
        },
        props.asPath,
        {
          locale: lang,
          shallow: false,
        }
      );
    }
  };

  const languageSelector = languageList && (
    <select
      onChange={(e) => changeLanguage(e.currentTarget.value)}
      className="languagePicker"
      value={props.sitecoreContext.language}
    >
      {languageList.map((language, index) => (
        <option
          key={index}
          value={language['Name']}
          label={languageNames.of(language['Name'])}
          className="languageItem"
        >
          {languageNames.of(language['Name'])}
        </option>
      ))}
    </select>
  );

  const links = props.fields?.data?.item?.children?.results?.map((item, index) => (
    <Link key={index} href={item.field?.jsonValue?.value?.href ?? '#'} prefetch={false}>
      <a>{item.displayName}</a>
    </Link>
  ));

  return (
    <>
      <div className={`header-eyebrow ${sxaStyles}`}>
        <div className="content">
          {languageSelector}
          {links}
        </div>
      </div>
      <Placeholder name="jss-header-content" rendering={props.rendering} />
    </>
  );
};

export default HeaderContent;
