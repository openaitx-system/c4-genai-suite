import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useApi } from 'src/api';
import { useStateOfSelectedAssistantId } from 'src/pages/chat/state/chat';
import { useListOfAssistantsStore } from './zustand/assistantStore';

/**
 * @description Initially loads the list of all known assistants to make it
 * available in global state.
 **/
export const useListOfAssistantsInit = () => {
  const api = useApi();
  const setAssistants = useListOfAssistantsStore((s) => s.setAssistants);

  const initialQueryGetAssistants = useQuery({
    queryKey: ['enabled-configurations'],
    queryFn: () => {
      return api.extensions.getConfigurations(true);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (initialQueryGetAssistants.data) setAssistants(initialQueryGetAssistants.data.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryGetAssistants.data]);
};

export const useStateOfAssistants = () => useListOfAssistantsStore((s) => s.assistants);

export const useStateOfSelectedAssistant = () => {
  const assistantId = useStateOfSelectedAssistantId();
  const assistants = useListOfAssistantsStore((s) => s.assistants);
  return assistants.find((x) => x.id === assistantId || assistants[0]);
};
