"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type FormInput = {
  repoURL: string;
  projectName: string;
  githubToken?: string;
};

function onSubmit(data: FormInput) {
  window.alert(JSON.stringify(data, null, 2));
  return true;
}
const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/person-using-laptop.svg/"
        alt="Person using Laptop"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your GitHub repository URL to get started with AetherAI
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoURL", { required: true })}
              placeholder="Github Repository URL"
              type="url"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Access Token"
            />
            <div className="h-4"></div>
            <Button type="submit">Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
