import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PropTypes from 'prop-types';

const ReactQueryProvider = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
            staleTime: 5 * 1000,
          },
        },
      })
      
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};


ReactQueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReactQueryProvider;