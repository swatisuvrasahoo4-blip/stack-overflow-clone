import type {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import {
  Edit,
  Plus,
  X,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditForm {
  name: string;
  about: string;
  tags: string[];
  profilePhoto: string;
}

interface EditProfileDialogProps {
  isEditing: boolean;
  setIsEditing: Dispatch<
    SetStateAction<boolean>
  >;
  username?: string;
  editForm: EditForm;
  setEditForm: Dispatch<
    SetStateAction<EditForm>
  >;
  newTag: string;
  setNewTag: Dispatch<
    SetStateAction<string>
  >;
  profilePhotoFile: File | null;
  setProfilePhotoFile: Dispatch<
    SetStateAction<File | null>
  >;
  profilePhotoPreview: string;
  setProfilePhotoPreview: Dispatch<
    SetStateAction<string>
  >;
  setRemoveProfilePhoto: Dispatch<
    SetStateAction<boolean>
  >;
  currentProfilePhoto?: string;
  profilePhotoInputRef: RefObject<HTMLInputElement | null>;
  handleAddTag: () => void;
  handleRemoveTag: (
    tag: string
  ) => void;
  handleSaveProfile: () => void | Promise<void>;
}

const EditProfileDialog = ({
  isEditing,
  setIsEditing,
  username,
  editForm,
  setEditForm,
  newTag,
  setNewTag,
  profilePhotoFile,
  setProfilePhotoFile,
  profilePhotoPreview,
  setProfilePhotoPreview,
  setRemoveProfilePhoto,
  currentProfilePhoto,
  profilePhotoInputRef,
  handleAddTag,
  handleRemoveTag,
  handleSaveProfile,
}: EditProfileDialogProps) => {
  const { t } = useTranslation();

  // Select profile photo
  const handleProfilePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    setProfilePhotoFile(file);

    if (!file) {
      return;
    }

    setRemoveProfilePhoto(false);

    setProfilePhotoPreview(
      URL.createObjectURL(file)
    );
  };

  // Clear selected profile photo
  const handleClearSelectedPhoto =
    () => {
      setProfilePhotoFile(null);

      setProfilePhotoPreview(
        currentProfilePhoto || ""
      );

      if (
        profilePhotoInputRef.current
      ) {
        profilePhotoInputRef.current.value =
          "";
      }
    };

  // Remove profile photo
  const handleRemoveProfilePhoto =
    () => {
      setProfilePhotoPreview("");
      setProfilePhotoFile(null);
      setRemoveProfilePhoto(true);

      if (
        profilePhotoInputRef.current
      ) {
        profilePhotoInputRef.current.value =
          "";
      }
    };

  return (
    <Dialog
      open={isEditing}
      onOpenChange={
        setIsEditing
      }
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          />
        }
      >
        <Edit className="h-4 w-4" />

        {t(
          "user.editProfile"
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>
            {t(
              "profile.edit_profile"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t(
                "profile.basic_information"
              )}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="username">
                  {t(
                    "profile.username"
                  )}
                </Label>

                <Input
                  id="username"
                  value={
                    username || ""
                  }
                  disabled
                  className="border-gray-300 bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="name">
                  {t(
                    "profile.display_name"
                  )}
                </Label>

                <Input
                  id="name"
                  value={
                    editForm.name
                  }
                  onChange={(
                    event
                  ) =>
                    setEditForm(
                      (
                        previous
                      ) => ({
                        ...previous,
                        name: event
                          .target
                          .value,
                      })
                    )
                  }
                  placeholder={t(
                    "profile.your_display_name"
                  )}
                  className="border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Profile photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t(
                "profile.profile_photo"
              )}
            </h3>

            <div>
              <Label htmlFor="profilePhoto">
                {t(
                  "profile.upload_photo"
                )}
              </Label>

              <input
                ref={
                  profilePhotoInputRef
                }
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  handleProfilePhotoChange
                }
              />

              <div className="mt-2 flex items-center rounded border p-2">
                <button
                  type="button"
                  onClick={() =>
                    profilePhotoInputRef.current?.click()
                  }
                  className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                  {t(
                    "profile.choose_file"
                  )}
                </button>

                <span
                  className={`ml-3 text-sm ${
                    profilePhotoFile
                      ? "text-gray-700"
                      : "text-red-600"
                  }`}
                >
                  {profilePhotoFile
                    ? t(
                        "profile.file_selected"
                      )
                    : t(
                        "profile.no_file_chosen"
                      )}
                </span>

                {profilePhotoFile && (
                  <button
                    type="button"
                    onClick={
                      handleClearSelectedPhoto
                    }
                    className="ml-auto text-xl font-bold text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {profilePhotoPreview && (
                <img
                  src={
                    profilePhotoPreview
                  }
                  alt="Profile preview"
                  className="mt-3 h-24 w-24 rounded-full border object-cover"
                />
              )}

              {profilePhotoPreview && (
                <button
                  type="button"
                  onClick={
                    handleRemoveProfilePhoto
                  }
                  className="mt-3 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  {t(
                    "profile.delete_profile_photo"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t(
                "profile.about"
              )}
            </h3>

            <Textarea
              id="about"
              value={
                editForm.about
              }
              onChange={(
                event
              ) =>
                setEditForm(
                  (
                    previous
                  ) => ({
                    ...previous,
                    about:
                      event.target
                        .value,
                  })
                )
              }
              placeholder={t(
                "profile.tell_us_about_yourself"
              )}
              className="min-h-32 border-gray-300 bg-white"
            />
          </div>

          {/* Skills and technologies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t(
                "profile.skills_and_technologies"
              )}
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={
                    newTag
                  }
                  onChange={(
                    event
                  ) =>
                    setNewTag(
                      event.target
                        .value
                    )
                  }
                  placeholder={t(
                    "profile.add_a_skill_or_technology"
                  )}
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="border-gray-300 bg-white"
                />

                <Button
                  type="button"
                  onClick={
                    handleAddTag
                  }
                  variant="outline"
                  size="sm"
                  className="bg-orange-600 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {editForm.tags.map(
                  (tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 bg-orange-100 text-orange-800"
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(
                            tag
                          )
                        }
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsEditing(
                  false
                )
              }
              className="bg-white text-gray-800 hover:text-gray-900"
            >
              {t(
                "profile.cancel"
              )}
            </Button>

            <Button
              type="button"
              onClick={() =>
                void handleSaveProfile()
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t(
                "profile.save_changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;