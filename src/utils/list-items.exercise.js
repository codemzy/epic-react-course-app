import {useQuery, useMutation, queryCache} from 'react-query'
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

// - `useRemoveListItem(user)`
// - `useCreateListItem(user)`

function useUpdateListItem(user) {
    const [update] = useMutation(
        updates =>
        client(`list-items/${updates.id}`, {
            method: 'PUT',
            data: updates,
            token: user.token,
        }),
        {onSettled: () => queryCache.invalidateQueries('list-items')},
    );
    return update;
};

function useRemoveListItem(user) {
    const [remove] = useMutation(
        ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
        {onSettled: () => queryCache.invalidateQueries('list-items')},
    );
    return remove;
};

function useCreateListItem(user) {
    const [create] = useMutation(
        ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
        {onSettled: () => queryCache.invalidateQueries('list-items')},
    )
    return create;
};

export {useListItems, useListItem, useUpdateListItem, useRemoveListItem, useCreateListItem};