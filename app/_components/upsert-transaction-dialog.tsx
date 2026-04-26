import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_FREQUENCY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { z } from "zod";
import {
  TransactionType,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionFrequency,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertTransaction } from "../_actions/upsert-transaction";
import { categorizeWithAI } from "../_actions/categorize-with-ai";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  transactionId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório.",
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "A categoria é obrigatória.",
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  isRecurring: z.boolean().default(false),
  frequency: z.nativeEnum(TransactionFrequency).optional().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertTransactionDialog = ({
  isOpen,
  defaultValues,
  transactionId,
  setIsOpen,
}: UpsertTransactionDialogProps) => {
  const [isCategorizing, setIsCategorizing] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      amount: 50,
      category: TransactionCategory.OTHER,
      date: new Date(),
      name: "",
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
      isRecurring: false,
      frequency: null,
    },
  });

  useEffect(() => {
    if (isOpen && defaultValues) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  const handleCategorizeWithAI = async () => {
    const name = form.getValues("name");
    if (!name) return;

    setIsCategorizing(true);
    try {
      const category = await categorizeWithAI(name);
      form.setValue("category", category);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCategorizing(false);
    }
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertTransaction({ ...data, id: transactionId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdate = Boolean(transactionId);
  const isRecurring = form.watch("isRecurring");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Atualizar" : "Criar"} transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Digite o nome..." {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCategorizeWithAI}
                        disabled={isCategorizing || !field.value}
                      >
                        {isCategorizing ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <SparklesIcon className="text-primary" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Digite o valor..."
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um método de pagamento..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Recorrente</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {isRecurring && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_FREQUENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {isUpdate ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
