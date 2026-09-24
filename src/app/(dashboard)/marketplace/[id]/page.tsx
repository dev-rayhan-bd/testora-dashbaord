import ProductDetailsPage from "@/components/marketplace/ProductDetailsPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ViewProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailsPage productId={id} />;
}
