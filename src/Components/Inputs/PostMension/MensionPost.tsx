import { FC, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Endpoints } from "../../../Api/Endpoints.ts";
import { buildRequest } from "../../../Api/buildRequest.ts";
import { Control, Controller } from "react-hook-form";
import Avatar from "../../Avatar/Avatar.tsx";
const defaultStyle = {
  control: {
    backgroundColor: "bg-[#77768029]",
    fontSize: 14,
    fontWeight: "normal",
    minHeight: "50px",
    borderRadiux: "5px",
  },
  highlighter: {
    overflow: "hidden",
  },
  input: {
    margin: 0,
    marginLeft: "10px",
    "&placeholder": {
      color: "#4c4c4e29",
      opacity: "1",
    },
  },
  placeholder: {
    fontSize: 30,
    color: "black",
  },
  "&placeholder": {
    color: "#4c4c4e29",
    opacity: "1",
  },

  "&multiLine": {
    control: {
      fontFamily: "monospace",
      minHeight: "63px",
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 9,
      minHeight: "80px",
      outline: 0,
      border: 0,
    },
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      height: "150px",
      overflow: "auto",
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5",
      },
    },
  },
};
interface IMensionPost {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  classNameContainer?: string;
  classNameOutline?: string;
  label?: string;
  placeHolder?: string;
  name: string;
  selectedUserIds: any;
  setSelectedUserIds: (value: any) => void;
  control: Control<any>;
}
const MensionPost: FC<IMensionPost> = (props) => {
  // const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [mentionedUsers, setMentionedUsers] = useState<Set<string>>(new Set());
  const {
    control,
    setValue,
    value,
    className,
    classNameContainer,
    classNameOutline,
    label,
    placeHolder,
    selectedUserIds,
    setSelectedUserIds,
    name,
  } = props;
  const handleOnChange = (
    event: any,
    newValue: any,
    newPlainTextValue: any
  ) => {
    setValue(newPlainTextValue);
  };
  const LIMIT_PAGINATION = 1000;

  const { hasNextPage, fetchNextPage, isLoading, data } = useInfiniteQuery({
    queryKey: [
      Endpoints.UserViewPost,
      "GET",
      { per_page: LIMIT_PAGINATION, is_remove_me: 1 },
    ],
    queryFn: (args) => buildRequest(args),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.data.length === LIMIT_PAGINATION
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: Infinity,
  });

  const users = data?.pages[0]?.data?.map((user: any) => ({
    display: user.name,
    id: user.id,
    avatar: user.profile_image,
  }));
  // Custom rendering function for dropdown items
  const renderUserSuggestion = (
    suggestion: any,
    search: any,
    highlightedDisplay: any,
    index: any,
    focused: any
  ) => (
    <div
      className={`user-suggestion-item ${focused ? "focused" : ""} bg-gray-100"
} flex items-center !pb-4 tablet:pb-0 overflow-auto h-auto px-2 gap-4 !cursor-pointer`}
    >
      <Avatar image={suggestion.avatar} className="max-w-[2.6rem]" />
      {highlightedDisplay}
    </div>
  );

  const suggestions = [
    { id: 1, display: "User1" },
    { id: 2, display: "User2" },
    { id: 3, display: "User3" },
    // Add more suggestions as needed
  ];

  // Add more suggestions as needed

  let filteredSuggestions = [];

  // Function to remove selected IDs from suggestions
  if (users && users.length) {
    const filteredSuggestions1 = users.filter(
      (suggestion: any) => !selectedUserIds?.includes(suggestion.id)
    );

    filteredSuggestions = filteredSuggestions1;
  }

  const handleAddMention = (id: string): void => {
    if (!selectedUserIds?.includes(id)) {
      setSelectedUserIds((prevIds: any) => [...prevIds, id]);
    }
    //   if (!mentionedUsers.has(id)) {
    //     setMentionedUsers(prev => new Set(prev.add(id)));
    // }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => {
        return (
          <div className={`${classNameContainer}`} id="mensionPlaceholder">
            <MentionsInput
              {...field}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              style={defaultStyle}
              className="bg-[#77768029] placeholder:!text-surface-20 text-base px-4 text-surface-10 font-normal leading-[1.5rem] focus:outline-none w-full mensionplaceholderdata"
              placeholder={placeHolder}
            >
              <Mention
                renderSuggestion={renderUserSuggestion}
                //  markup="@{{id||display||image}}"
                displayTransform={(id, display) => "@" + display}
                trigger="@"
                style={{
                  backgroundColor: "#77768029]",
                }}
                data={filteredSuggestions}
                // data={users}
                //  data={users.filter((user:any) => !mentionedUsers.includes(user.id))}
                onAdd={(id: any) => handleAddMention(id)}
              />
            </MentionsInput>
          </div>
        );
      }}
    />
  );
};

export default MensionPost;
