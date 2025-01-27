"use client";

import { Error_Response } from "@/lib/types";
import React from "react";

type TypeErrorProps = {
  error: Error_Response;
  className?: string;
};
const ErrorMassage = (props: TypeErrorProps) => {
  return <p className={`text-rose-400 mt-2 text-xs font-bold ${props.className}`}>{props.error.message}</p>;
};

export { ErrorMassage };
