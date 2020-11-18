import {useQuery} from 'react-query'
import {client} from './api-client'

function useListItems(user) {
    const {data} = useQuery({
        queryKey: 'list-items',
        queryFn: () =>
        client(`list-items`, {token: user.token}).then(data => data.listItems),
    });
    return data || [];
};

function useListItem(user, bookId) {
    const listItems = useListItems(user);
    return listItems.find(li => li.bookId === bookId) ?? null
};

export {useListItems, useListItem};