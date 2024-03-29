import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductRequest,
  SearchProductResponse,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductResponse, string>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
    }),
    searchProducts: builder.query<SearchProductResponse, SearchProductRequest>({
      query: ({ price, search, sort, category, page }) => {
        let base = `filter?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation
} = productAPI;
