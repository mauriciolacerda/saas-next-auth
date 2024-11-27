import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { User } from "@/modules/user/user.type";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const CardProfileAvatar = ({ user }: { user: User }) => {
  const [image, setImage] = useState<File | null>(null);
  const { data: session, update } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadClick = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;

      const response = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64, userId: user.id }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setImage(null);
        await update({image: updatedUser.image, name: updatedUser.name, company: updatedUser.company, jobTitle: updatedUser.jobTitle});
        toast({
          title: "Imagem de perfil atualizada",
          description: "Sua nova imagem de perfil foi salva com sucesso.",
        });
      } else {
        console.error('Erro ao atualizar avatar');
      }
    };
    reader.readAsDataURL(image);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return ""; 
    
    return name
      .split(" ")
      .map((n, i, arr) => 
        i === 0 || i === arr.length - 1 ? n[0] : ""
      )
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-6">
      <form action="#" method="POST">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          Imagem de perfil
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Atualize a imagem do seu perfil
        </p>
        <div className="mt-6 flex justify-between items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={(preview || user.image) ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="bg-blue-600 text-white ">
              {getInitials(user?.name) || "W"}
                </AvatarFallback>
          </Avatar>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={"outline"}
              size="sm"
              onClick={handleUploadClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              Carregar nova foto
            </Button>
            <Button
              type="button"
              size="sm"
              variant={"outline"}
              className="text-red-600"
            >
              Remover
            </Button>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {image && (
          <Button type="button" onClick={handleUpload} size="sm">
            Salvar
          </Button>
        )}
        </div>
      </form>
    </Card>
  );
};

export default CardProfileAvatar;
