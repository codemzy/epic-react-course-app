import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from './books'
import {client} from './api-client'

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
        onMutate: function(updates) { // optimistic update
            let currentData = queryCache.getQueryData('list-items');
            queryCache.setQueryData('list-items', function(oldData) {
                return oldData.map(function(item) {
                    return item.id === updates.id ? {...item, ...updates} : item;
                });
            });
            return () => queryCache.setQueryData('list-items', currentData) // return a function that can be run on error to restore data
        },
        ...defaultMutationOptions, 
        ...options, 
    },
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {
        onMutate: function({id}) { // optimistic update
            let currentData = queryCache.getQueryData('list-items');
            queryCache.setQueryData('list-items', function(oldData) {
                return oldData.filter(function(item) {
                    return item.id !== id;
                });
            });
            return () => queryCache.setQueryData('list-items', currentData) // return a function that can be run on error to restore data
        },
        ...defaultMutationOptions, 
        ...options
    },
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    {
        ...defaultMutationOptions, 
        ...options
    },
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
