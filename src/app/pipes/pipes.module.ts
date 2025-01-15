import { FixCategoryPipe } from "./fix-category/fix-category.pipe";
import { FixLabelPipe } from "./fix-label/fix-label.pipe";
import { FormatCpfCnpjPipe } from "./format-cpfCnpj/format-cpf-cnpj.pipe";
import { FormatPhonePipe } from "./format-phone/format-phone.pipe";
import { FromNowPipe } from "./from-now/from-now.pipe";
import { NgModule } from "@angular/core";
import { TitleExtractPipe } from "./title-extract/title-extract.pipe";
import { IconExtractPipe } from "./icon-extract/icon-extract.pipe";

@NgModule({
  declarations: [FromNowPipe, FixLabelPipe, FixCategoryPipe, FormatCpfCnpjPipe, FormatPhonePipe, TitleExtractPipe, IconExtractPipe],
  imports: [],
  exports: [FromNowPipe, FixLabelPipe, FixCategoryPipe, FormatCpfCnpjPipe, FormatPhonePipe, TitleExtractPipe, IconExtractPipe],
})
export class PipesModule {}
