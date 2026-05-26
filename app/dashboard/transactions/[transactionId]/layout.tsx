import BreadCrumbComp from "@/components/bread-crumb-comp";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto py-10">
      <BreadCrumbComp
        breadcrumbItems={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/transactions", label: "Transactions" },
          { href: "", label: "Edit Transaction" },
        ]}
      />
      {children}
    </div>
  );
}
