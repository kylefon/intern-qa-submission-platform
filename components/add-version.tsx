"use client";
import { addNewVersion } from "@/utils/actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { FormMessage } from "./form-message";

const formSchema = z.object({
    new_version: z.string().min(1),
    new_version_link: z.string(),
});


export function AddVersion({ appName }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            new_version: "",
            new_version_link: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await addNewVersion(appName, values.new_version, values.new_version_link);       
        } catch(error) {
           console.log(error); 
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <PlusCircleIcon onClick={() => setIsDialogOpen(true)}></PlusCircleIcon>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new version</DialogTitle>
                    <DialogDescription>Add a new version for this ticket group.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="new_version"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Version</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New version..." id="new_version" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="new_version_link"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New Version Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter link here" id="new_version_link" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex justify-end space-x-1 mt-6">
                            <Button 
                                type="button" 
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 
                                (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin" />
                                        Submitting...
                                    </div>
                                ) : 
                                (
                                    <div>
                                        Submit
                                    </div>
                                )
                                }
                                </Button>
                        </div> 
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}