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
    const res = await fetch("https://fakestoreapi.com/products", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();
    const isJSON = res.headers
      .get("content-type")
      ?.includes("application/json");

    if (!res.ok || !isJSON) {
      console.error("FakeStore responded with non-JSON:", {
        status: res.status,
        contentType: res.headers.get("content-type"),
        preview: text.slice(0, 200),
      });
    } else {
      products = JSON.parse(text);
    }
  } catch (err) {
    console.error("FakeStore fetch failed:", err);
  }

  return {
    props: {
      products,
      session,
    },
  };
}
