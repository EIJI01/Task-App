"use client";

import { UserType } from "@/lib/types";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

const UserContext = createContext<{ user: UserType | null }>({
  user: null,
});

const UserContextProvider = (props: PropsWithChildren<{ user: UserType | null }>) => {
  return <UserContext.Provider value={{ user: props.user }}>{props.children}</UserContext.Provider>;
};

const useUserContext = () => {
  const context = useContext<{ user: UserType | null }>(UserContext);
  if (!context) throw new Error("useUserContext must be in side UserContextProvider.");
  return context;
};

export { UserContextProvider, useUserContext };
