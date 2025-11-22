import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import { getSession } from "next-auth/react";

export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon Clone</title>
      </Head>
      <Header />
      <main className="max-w-screen-2xl mx-auto">
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let products = [];

  try {
    const res = await fetch("https://fakestoreapi.com/products");

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      console.error("FakeStore API error:", {
        status: res.status,
        contentType,
      });
    } else {
      products = await res.json();
    }
  } catch (err) {
    console.error("Error fetching products from FakeStore:", err);
  }

  return {
    props: {
      products,
      session,
    },
  };
}
