import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateMessageDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Message must be a string" })
  @IsNotEmpty({ message: "Message is required" })
  @Length(1, 1000, {
    message: "Message must be between 1 and 1000 characters",
  })
  @Matches(/^(?!.*<script\b)(?!.*javascript:)(?!.*on\w+\s*=).*$/i, {
    message: "Message contains potentially harmful content",
  })
    message!: string;
}
