import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class AskQuestionDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Question must be a string" })
  @IsNotEmpty({ message: "Question is required" })
  @Length(1, 1000, {
    message: "Question must be between 1 and 1000 characters",
  })
  @Matches(/^(?!.*<script\b)(?!.*javascript:)(?!.*on\w+\s*=).*$/i, {
    message: "Question contains potentially harmful content",
  })
    question!: string;
}
