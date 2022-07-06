//返回一个provider
import createStore, { IStore } from './rootStore';
import React, { createContext, ReactElement } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import { useContext } from 'react';


interface IProps {
  initialValue: Record<any, any>;
  children: ReactElement;
}

enableStaticRendering(true);

const StoreContext = createContext({});

export const StoreProvider = ({ initialValue, children }: IProps) => {
  const store: IStore = useLocalObservable(createStore(initialValue));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;
  if(!store){
    throw new Error('数据不存在')
  }
  return store
};
