import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import { BackLink, Heading, Main, GridRow, GridCol } from 'govuk-react';
import { CompleteHeader } from '../../components/CompleteHeader';
import { CompleteFooter } from '../../components/CompleteFooter';

export function ManageTemplate() {
  const { t } = useTranslation();

  return (
    <div>
      <CompleteHeader />
      <Main>
        <BackLink
          onClick={function noRefCheck() {
            history.back();
          }}
        >
          {t('back')}
        </BackLink>

        <GridRow>
          <GridCol setWidth="two-thirds">
            <Heading size="MEDIUM" id="template-heading">
              {t('manageYourTemplates.title')}
            </Heading>
          </GridCol>
        </GridRow>
      </Main>
      <CompleteFooter />
    </div>
  );
}
export default ManageTemplate;
