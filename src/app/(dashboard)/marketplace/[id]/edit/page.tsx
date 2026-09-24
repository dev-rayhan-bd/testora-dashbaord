import ProductEditorPage from "@/components/marketplace/editor/ProductEditorPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductEditorPage productId={id} />;
}
