"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { addDays, format } from "date-fns";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { type Category } from "@/types/Category";

type TransactionType = "income" | "expense";

function getLocalToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const today = getLocalToday();

export const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.coerce
    .date()
    .max(addDays(today, 1), "Transaction date cannot be in the future"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must contain at maximum of 300 characters"),
});

const defaultValues: z.infer<typeof transactionFormSchema> = {
  transactionType: "income",
  categoryId: 0,
  transactionDate: today,
  amount: 0,
  description: "",
};

type Props = {
  categories: Category[];
  onSubmit: (values: z.infer<typeof transactionFormSchema>) => Promise<void>;
  transaction?: {
    transactionType: "income" | "expense";
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  };
};

export default function TransactionForm({
  categories,
  onSubmit,
  transaction,
}: Props) {
  const form = useForm({
    validators: {
      onChange: transactionFormSchema,
    },
    defaultValues:{
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      transactionType: "income",
      ...transaction,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as z.infer<typeof transactionFormSchema>);
    },
  });

  return (
    <Form
      form={form}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-5"
    >
      <fieldset
        disabled={form.state.isSubmitting}
        className="grid grid-cols-1 items-start gap-x-2 gap-y-5 md:grid-cols-2"
      >
        <form.Field name="transactionType">
          {(field) => (
            <FormField>
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.state.value}
                    onValueChange={(newValue) => {
                      field.handleChange(newValue as TransactionType);
                      form.setFieldValue("categoryId", 0);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {field.state.meta.errors[0]?.message?.toString() || ""}
                </FormMessage>
              </FormItem>
            </FormField>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.transactionType}>
          {(transactionType) => {
            const filteredCategories = categories.filter(
              (category) => category.type === transactionType,
            );

            return (
              <form.Field name="categoryId">
                {(field) => {
                  const selectedCategoryName =
                    filteredCategories.find(
                      (category) => category.id === field.state.value,
                    )?.name ?? "";

                  return (
                    <FormField>
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            value={
                              field.state.value > 0
                                ? String(field.state.value)
                                : ""
                            }
                            onValueChange={(newValue) => {
                              field.handleChange(Number(newValue));
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category">
                                {selectedCategoryName}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {filteredCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>
                          {field.state.meta.errors[0]?.message?.toString() ||
                            ""}
                        </FormMessage>
                      </FormItem>
                    </FormField>
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Field name="transactionDate">
          {(field) => (
            <FormField>
              <FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start text-left font-normal",
                        !field.state.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.state.value ? (
                        format(field.state.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                         defaultMonth={field.state.value ?? today}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            field.handleChange(selectedDate);
                          }
                        }}
                        disabled={{
                          after: today,
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage>
                  {field.state.meta.errors[0]?.message?.toString() || ""}
                </FormMessage>
              </FormItem>
            </FormField>
          )}
        </form.Field>

        <form.Field name="amount">
          {(field) => (
            <FormField>
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {field.state.meta.errors[0]?.message?.toString() || ""}
                </FormMessage>
              </FormItem>
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <fieldset
        disabled={form.state.isSubmitting}
        className="flex flex-col gap-5"
      >
        <form.Field name="description">
          {(field) => (
            <FormField>
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {field.state.meta.errors[0]?.message?.toString() || ""}
                </FormMessage>
              </FormItem>
            </FormField>
          )}
        </form.Field>

        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  );
}
