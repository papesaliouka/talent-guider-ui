import { NonAuthGuard } from 'src/guards/non-auth-guard';

export const withNonAuthGuard = (Component) => (props) => (
  <NonAuthGuard>
    <Component {...props} />
  </NonAuthGuard>
);